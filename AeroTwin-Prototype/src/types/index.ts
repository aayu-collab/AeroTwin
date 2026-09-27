export type Role = 'Operator' | 'Engineer' | 'Maintenance' | 'Planner' | 'Manager' | 'Admin';
export type Severity = 'INFO' | 'CAUTION' | 'WARNING' | 'CRITICAL';
export type Subsystem = 'Combustion' | 'Thermal' | 'Lubrication' | 'Mechanical' | 'Fuel' | 'Electrical';
export type Fault = 'Normal' | 'Misfire' | 'Injector abnormality' | 'Cooling degradation' | 'Lubrication issue' | 'Sensor drift/failure' | 'Combustion instability' | 'Overheating trend' | 'Abnormal vibration';
export type Source = 'SYNTHETIC' | 'REPLAY';
export interface Engine { id:string; model:string; hours:number; cycles:number; hi:number[]; rul:[number,number,number]; status:string; mission:string; }
export interface Channel { key:string; name:string; group:string; unit:string; nominal:[number,number]; base:number; rate:number; }
export interface Sample { key:string; measured:number; predicted:number; residual:number; time:number; reconstructed?:boolean; }
export interface Incident { id:string; engineId:string; title:string; subsystem:Subsystem; severity:Severity; confidence:number; state:'Active'|'Acknowledged'|'Contained'; first:string; evidence:string[]; action:string; fault:Fault; model:string; related:number; notes:string[]; }
export interface Advisory { id:string; engineId:string; subsystem:Subsystem; title:string; cause:string; action:string; urgency:string; evidence:string; status:'Open'|'Scheduled'|'Actioned'; date:string; note:string; reset:boolean; }
export interface AuditEvent { id:string; time:string; actor:Role; action:string; target:string; result:string; }
export interface Model { id:string; version:string; kind:string; status:'Active'|'Candidate'|'Archived'; dataset:string; features:string[]; hyperparameters:string; metrics:string; date:string; }
export interface User {id:string;name:string;email:string;role:Role;active:boolean;}
export interface Config {cylinders:number; cooling:string; chtLimit:number; oilMin:number; staleSeconds:number; retention:number; weights:number[]; bands:[number,number,number]; dbc:string; version:string;}
export interface MissionProfile {name:string; type:string; duration:number; altitude:number; ambient:number; pressure:number; throttle:number; fuel:number; load:number; seed:number; fault:Fault; onset:number; ramp:number; altitudeSchedule:string; throttleProfile:string;}
export interface SimPoint {time:number;rpm:number;cht:number;egt:number;oilTemp:number;oilPress:number;fuelFlow:number;hi:number;}
export interface Simulation {id:string;engineId:string;profile:MissionProfile;created:string;risk:'LOW'|'ELEVATED'|'HIGH';driver:string;fuel:number;peak:number;margin:number;endHi:number;rulUsed:[number,number,number];stress:number;series:SimPoint[];}
export interface Settings {temperature:'C'|'F';pressure:'PSI'|'bar';fuel:'L/h'|'kg/h';rate:number;name:string;notifications:boolean;}
export interface Store {version:number;engines:Engine[];incidents:Incident[];advisories:Advisory[];audit:AuditEvent[];models:Model[];users:User[];configs:Record<string,Config>;runs:Simulation[];settings:Settings;session:Role|null;onboarded:boolean;}
export type Action = 'ack'|'contain'|'maintenance'|'simulate'|'inject'|'admin'|'config'|'model';
