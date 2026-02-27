import { useState } from 'react';
import { apiService } from '../../services/api';

export default function AdminLogin() {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			await apiService.login(password);
			window.location.href = '/admin';
		} catch (err: any) {
			setError(err.message || 'Error al iniciar sesión');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full rounded-3xl border-2 border-brand-stone/60 bg-brand-night/80 p-8 shadow-2xl backdrop-blur-xl">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-black uppercase text-brand-light">Panel Admin</h1>
				<p className="mt-2 text-sm text-brand-light/60">Ingresa tu contraseña para continuar</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.2em] text-brand-light/80">
						Contraseña
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded-xl border border-brand-stone/60 bg-brand-ink/50 px-4 py-3 text-brand-light placeholder:text-brand-light/40 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
						placeholder="Ingresa la contraseña"
						required
					/>
					{error && (
						<p className="mt-2 text-xs text-red-400">{error}</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-xl border-2 border-brand-amber bg-brand-amber px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-ink transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(247,148,31,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? 'Verificando...' : 'Ingresar'}
				</button>
			</form>

			<div className="mt-6 rounded-xl border border-brand-amber/20 bg-brand-amber/5 p-4">
				<p className="text-xs text-brand-light/60">
					<strong className="text-brand-amber">Nota:</strong> Acceso restringido a administradores autorizados.
				</p>
			</div>
		</div>
	);
}
