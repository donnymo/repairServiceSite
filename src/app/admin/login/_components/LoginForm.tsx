'use client';

import { useActionState } from 'react';
import { Logo } from '@/components/Logo';
import { login, type LoginState } from '../../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={action} className="login-card">
      <Logo />
      <div>
        <h1>Вход в панель управления</h1>
        <p className="muted login-subtitle">Только для сотрудников сервиса</p>
      </div>
      {state?.error && (
        <div className="alert alert-error" role="alert">
          {state.error}
        </div>
      )}
      <div className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          autoComplete="username"
          required
          defaultValue={state?.email ?? ''}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          autoComplete="current-password"
          required
        />
      </div>
      <button type="submit" className="btn btn-dark btn-block btn-tall" disabled={pending}>
        {pending ? 'Входим…' : 'Войти'}
      </button>
    </form>
  );
}
