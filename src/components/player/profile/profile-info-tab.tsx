'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/playcourt/button';
import { Input } from '@/components/playcourt/input';
import { usePlayerProfile, useUpdatePlayer } from '@/hooks/use-player-profile';
import { api } from '@/lib/api/client';
import { Loader2 } from 'lucide-react';

interface ProfileFormData {
  name: string;
  phone: string;
  avatarUrl: string;
}

export function ProfileInfoTab() {
  const { data: player, isLoading } = usePlayerProfile();
  const updatePlayer = useUpdatePlayer();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    values: player
      ? {
          name: player.name,
          phone: player.phone,
          avatarUrl: player.avatar ?? '',
        }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updatePlayer.mutateAsync({ name: data.name, avatarUrl: data.avatarUrl.trim() || null });
      reset(data);
    } catch {
      return;
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    try {
      const response = await api.auth.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setPasswordMessage(response.message || 'Đã đổi mật khẩu.');
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : 'Không thể đổi mật khẩu.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--pc-mute)]" />
      </div>
    );
  }

  if (!player) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = player.avatar;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-full">
          {avatarUrl ? (
            <img src={avatarUrl} alt={player.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--pc-green-800)] text-3xl font-semibold text-white">
              {getInitials(player.name)}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--pc-ink)]">Tên</label>
          <Input
            {...register('name', {
              required: 'Tên không được để trống',
              minLength: { value: 2, message: 'Tên phải có ít nhất 2 ký tự' },
            })}
            placeholder="Nhập tên của bạn"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--pc-ink)]">Email</label>
          <Input value={player.email} disabled className="bg-gray-50" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--pc-ink)]">
            Số điện thoại
          </label>
          <Input {...register('phone')} disabled className="bg-gray-50" />
          <p className="mt-1 text-xs text-[var(--pc-mute)]">Backend chưa hỗ trợ cập nhật phone trong profile DTO.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--pc-ink)]">Avatar URL</label>
          <Input {...register('avatarUrl')} type="url" placeholder="https://..." />
        </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="Secondary"
          onClick={() => reset()}
          disabled={!isDirty || updatePlayer.isPending}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="AppPrimary"
          disabled={!isDirty || updatePlayer.isPending || Object.keys(errors).length > 0}
        >
          {updatePlayer.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            'Lưu thay đổi'
          )}
        </Button>
      </div>
      </form>

      <form onSubmit={changePassword} className="rounded-[8px] border border-[var(--pc-hairline)] bg-white p-5">
        <h2 className="text-lg font-semibold text-[var(--pc-ink)]">Đổi mật khẩu</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input required label="Mật khẩu hiện tại" type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} />
          <Input required label="Mật khẩu mới" type="password" minLength={6} value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} />
        </div>
        <Button type="submit" className="mt-4" disabled={passwordSaving}>
          {passwordSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </Button>
        {passwordMessage && <p className="mt-3 text-sm text-[var(--pc-body)]">{passwordMessage}</p>}
      </form>
    </div>
  );
}
