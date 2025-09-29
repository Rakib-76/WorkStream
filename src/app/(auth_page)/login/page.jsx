"use client";
import React, { Suspense } from "react";
import LoginForm from "./component/LoginForm";

export default function LoginPage() {

  return (
    <div className="card  w-full max-w-sm shrink-0 shadow-2xl">
      <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
    </div>
  );
}
