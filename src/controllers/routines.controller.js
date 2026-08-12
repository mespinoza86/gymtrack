import * as service from '../services/routines.service.js';
export async function exercises(req,res){res.json({exercises:await service.listExercises(req.session.user.id)});}
export async function exerciseLibrary(req,res){res.json({exercises:await service.exerciseLibrary(req.session.user.id)});}
export async function createExercise(req,res){res.status(201).json({exercise:await service.createExercise(req.session.user.id,req.body)});}
export async function updateExercise(req,res){res.json({exercise:await service.updateExercise(req.params.id,req.session.user.id,req.body)});}
export async function setExerciseStatus(req,res){res.json({exercise:await service.setExerciseStatus(req.params.id,req.session.user.id,req.body.isActive)});}
export async function deleteExercise(req,res){await service.deleteExercise(req.params.id,req.session.user.id);res.status(204).end();}
export async function routines(req,res){res.json({routines:await service.listRoutines(req.session.user)});}
export async function routine(req,res){res.json({routine:await service.getRoutine(req.params.id,req.session.user)});}
export async function createRoutine(req,res){res.status(201).json({routine:await service.createRoutine(req.session.user.id,req.body)});}
export async function updateRoutine(req,res){res.json({routine:await service.updateRoutine(req.params.id,req.session.user.id,req.body)});}
export async function start(req,res){res.status(201).json({session:await service.startWorkout(req.session.user.id,req.body.routineDayId)});}
export async function finish(req,res){res.json({session:await service.finishWorkout(req.session.user.id,req.params.id,req.body)});}
export async function history(req,res){res.json({workouts:await service.workoutHistory(req.session.user.id)});}
