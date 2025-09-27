/* eslint-disable no-var */
declare global {
  // simple in-memory stores for dev
  var __merit_profiles: Map<string, any> | undefined;
  var __merit_jobs: Map<string, any> | undefined;
  var __merit_applications: Map<string, any> | undefined;
}

export {};
