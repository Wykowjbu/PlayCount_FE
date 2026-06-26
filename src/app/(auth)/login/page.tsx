'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authService.login({
        identifier: formData.email,
        password: formData.password,
      })

      if (response.success && response.data) {
        const user = response.data.user

        // Redirect dựa trên role
        if (user.role === 'Owner') {
          router.push('/owner/dashboard')
        } else if (user.role === 'Admin') {
          router.push('/admin/kyc')
        } else {
          router.push('/matches')
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại')
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.')
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
        Chào mừng trở lại
      </div>
      <h1 className="text-3xl font-semibold leading-10 mb-2">Đăng nhập</h1>
      <p className="text-gray-500 mb-7">
        Tiếp tục đặt sân và tham gia trận đấu.
      </p>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="font-medium text-sm">
            Email hoặc số điện thoại
          </label>
          <input
            id="email"
            type="text"
            autoComplete="username"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="font-medium text-sm">
              Mật khẩu
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-green-800 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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
        </div>

        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            className="w-[18px] h-[18px] accent-green-800"
          />
          Ghi nhớ đăng nhập
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-12 bg-green-900 text-white font-medium rounded-md hover:bg-green-950 active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-gray-500">
          <div className="h-px bg-gray-200" />
          hoặc
          <div className="h-px bg-gray-200" />
        </div>

        <button
          type="button"
          className="w-full min-h-[42px] bg-white border border-gray-200 rounded-md font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <span className="mr-2">G</span>Tiếp tục với Google
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-gray-700 mt-6">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-medium text-green-800 hover:underline">
          Đăng ký miễn phí
        </Link>
      </p>
    </div>
  )
}
