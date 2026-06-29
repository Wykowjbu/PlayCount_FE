'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<'player' | 'owner'>('player')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (role === 'owner' && !formData.businessName.trim()) {
      setError('Chủ sân cần nhập tên doanh nghiệp.')
      return
    }
    setIsLoading(true)
    try {
      const response = await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        password: formData.password,
        role: role === 'owner' ? 'CourtOwner' : 'Player',
        businessName: role === 'owner' ? formData.businessName.trim() : null,
      })
      setMessage(response.message || 'Đăng ký thành công. Vui lòng xác minh email.')
      router.push(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Brand mobile */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg border border-gray-800 bg-gray-900 relative overflow-hidden">
          <div className="absolute w-3 h-3 left-[13px] top-1 bg-[#c7f227] rounded-full" />
          <div className="absolute w-[11px] h-[11px] left-1 top-3.5 bg-white rounded-full" />
        </div>
        <span className="text-lg font-semibold tracking-tight">PlayCourt</span>
      </div>

      {/* Header */}
      <div className="font-mono text-xs font-medium text-gray-600 mb-2.5">
        Bắt đầu
      </div>
      <h1 className="text-3xl font-semibold leading-10 mb-2">Tạo tài khoản</h1>
      <p className="text-gray-500 mb-7">
        Chọn mục đích chính. Có thể đổi sau.
      </p>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {message && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-1 border border-gray-200 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setRole('player')}
            className={`h-9 rounded-md font-medium transition-all ${
              role === 'player'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-700'
            }`}
          >
            Người chơi
          </button>
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`h-9 rounded-md font-medium transition-all ${
              role === 'owner'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-700'
            }`}
          >
            Chủ sân
          </button>
        </div>

        <div className="grid gap-2">
          <label htmlFor="fullName" className="font-medium text-sm">
            Họ và tên
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
            required
          />
        </div>

        {role === 'owner' && (
          <div className="grid gap-2">
            <label htmlFor="businessName" className="font-medium text-sm">
              Tên doanh nghiệp
            </label>
            <input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
              required={role === 'owner'}
            />
          </div>
        )}

        <div className="grid gap-2">
          <label htmlFor="email" className="font-medium text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="ban@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="phone" className="font-medium text-sm">
            Số điện thoại
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="09xx xxx xxx"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="font-medium text-sm">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 pr-11 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? '⊘' : '◉'}
            </button>
          </div>
          <span className="text-xs text-gray-500">
            Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số.
          </span>
        </div>

        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="w-[18px] h-[18px] accent-green-800"
            required
          />
          Tôi đồng ý Điều khoản và Chính sách quyền riêng tư.
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-12 bg-green-900 text-white font-medium rounded-md hover:bg-green-950 active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-gray-700 mt-6">
        Đã có tài khoản?{' '}
        <Link href="/login" className="font-medium text-green-800 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
