import { useFormContext } from 'react-hook-form';
import type { ProfileData } from '../../../types/profile';

export const StepPersonal = () => {
  const { register, formState: { errors } } = useFormContext<ProfileData>();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Personal Details</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input {...register('fullName', { required: 'Name is required' })} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="John Doe" />
          {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input {...register('email', { required: 'Email is required' })} type="email" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="john@example.com" />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
          <input {...register('phone', { required: 'Phone is required' })} type="tel" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="+1234567890" />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn (Optional)</label>
          <input {...register('linkedin')} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="linkedin.com/in/johndoe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">GitHub (Optional)</label>
          <input {...register('github')} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="github.com/johndoe" />
        </div>
      </div>
    </div>
  );
};
