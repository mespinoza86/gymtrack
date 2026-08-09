import { pool } from '../config/database.js';

export async function addMeasurement(athleteId, recordedBy, input) {
  return (await pool.query(`INSERT INTO measurements
    (athlete_id,recorded_by,measured_at,weight_kg,body_fat_percent,waist_cm,hip_cm,chest_cm,arm_cm,thigh_cm,notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (athlete_id,measured_at) DO UPDATE SET recorded_by=EXCLUDED.recorded_by,weight_kg=EXCLUDED.weight_kg,
    body_fat_percent=EXCLUDED.body_fat_percent,waist_cm=EXCLUDED.waist_cm,hip_cm=EXCLUDED.hip_cm,chest_cm=EXCLUDED.chest_cm,
    arm_cm=EXCLUDED.arm_cm,thigh_cm=EXCLUDED.thigh_cm,notes=EXCLUDED.notes RETURNING *`,
  [athleteId,recordedBy,input.measuredAt,input.weightKg??null,input.bodyFatPercent??null,input.waistCm??null,input.hipCm??null,input.chestCm??null,input.armCm??null,input.thighCm??null,input.notes||null])).rows[0];
}
export async function measurements(athleteId){return (await pool.query('SELECT * FROM measurements WHERE athlete_id=$1 ORDER BY measured_at DESC LIMIT 365',[athleteId])).rows;}
export async function createCheckin(athleteId,input){return (await pool.query(`INSERT INTO checkins
  (athlete_id,trainer_id,checkin_date,energy,sleep_hours,stress,hunger,adherence,pain_details,wins,difficulties)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,[athleteId,input.trainerId,input.checkinDate,input.energy,input.sleepHours,input.stress,input.hunger,input.adherence,input.painDetails||null,input.wins||null,input.difficulties||null])).rows[0];}
export async function checkins(user){const column=user.role==='trainer'?'trainer_id':'athlete_id';return (await pool.query(`SELECT c.*,a.first_name AS athlete_first_name,a.last_name AS athlete_last_name,t.first_name AS trainer_first_name,t.last_name AS trainer_last_name FROM checkins c JOIN users a ON a.id=c.athlete_id JOIN users t ON t.id=c.trainer_id WHERE c.${column}=$1 ORDER BY checkin_date DESC LIMIT 100`,[user.id])).rows;}
export async function reviewCheckin(trainerId,id,feedback){return (await pool.query(`UPDATE checkins SET trainer_feedback=$3,reviewed_at=NOW() WHERE id=$1 AND trainer_id=$2 RETURNING *`,[id,trainerId,feedback])).rows[0];}
export async function createNutritionPlan(trainerId,input){const plan=(await pool.query(`INSERT INTO nutrition_plans (trainer_id,athlete_id,name,description,calories,protein_g,carbs_g,fats_g,fiber_g,water_ml,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active') RETURNING *`,[trainerId,input.athleteId,input.name,input.description||null,input.calories??null,input.proteinG??null,input.carbsG??null,input.fatsG??null,input.fiberG??null,input.waterMl??null])).rows[0];for(let i=0;i<input.meals.length;i+=1){await pool.query('INSERT INTO nutrition_meals (plan_id,name,meal_order,details) VALUES ($1,$2,$3,$4)',[plan.id,input.meals[i].name,i+1,input.meals[i].details]);}return plan;}
export async function nutritionPlans(user){const column=user.role==='trainer'?'trainer_id':'athlete_id';return (await pool.query(`SELECT p.*,u.first_name AS athlete_first_name,u.last_name AS athlete_last_name,COALESCE(json_agg(json_build_object('id',m.id,'name',m.name,'details',m.details,'order',m.meal_order) ORDER BY m.meal_order) FILTER(WHERE m.id IS NOT NULL),'[]') AS meals FROM nutrition_plans p JOIN users u ON u.id=p.athlete_id LEFT JOIN nutrition_meals m ON m.plan_id=p.id WHERE p.${column}=$1 AND p.status='active' GROUP BY p.id,u.first_name,u.last_name ORDER BY p.updated_at DESC`,[user.id])).rows;}
