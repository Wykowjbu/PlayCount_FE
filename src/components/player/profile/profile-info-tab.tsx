'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/playcourt/button';
import { Input } from '@/components/playcourt/input';
import { usePlayerProfile, useUpdatePlayer, useUploadAvatar } from '@/hooks/use-player-profile';
import { Upload, Loader2 } from 'lucide-react';

interface ProfileFormData {
  name: string;
  phone: string;
}

export function ProfileInfoTab() {
  const { data: player, isLoading } = usePlayerProfile();
  const updatePlayer = useUpdatePlayer();
  const uploadAvatar = useUploadAvatar();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        }
      : undefined,
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setAvatarPreview(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarPreview(null);
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      await uploadAvatar.mutateAsync(file);
    } catch {
      // Upload not supported yet — keep local preview
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updatePlayer.mutateAsync(data);
      reset(data);
    } catch {
      return;
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

  const avatarUrl = avatarPreview || player.avatar;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-8">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div
          className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full"
          onClick={handleAvatarClick}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={player.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-semibold text-white">
              {getInitials(player.name)}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            {uploadAvatar.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-white" />
                <p className="mt-1 text-xs text-white">Upload ảnh</p>
              </div>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Form */}
      <div className="space-y-6">
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
          <Input
            {...register('phone', {
              required: 'Số điện thoại không được để trống',
              pattern: {
                value: /^(\+84|0)\d{9,10}$/,
                message: 'Số điện thoại không hợp lệ',
              },
            })}
            placeholder="+84 hoặc 0xxxxxxxxx"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
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
  );
}
