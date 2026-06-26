'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Gọi API gửi OTP
    console.log('Send OTP to:', email)
    setStep('otp')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Gọi API reset password
    console.log('Reset password:', { email, otp: otp.join(''), newPassword })
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
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

      {step === 'email' ? (
        <>
          {/* Email Step */}
          <div className="font-mono text-xs font-medium text-gray-600 mb-2.5">
            Khôi phục tài khoản
          </div>
          <h1 className="text-3xl font-semibold leading-10 mb-2">Quên mật khẩu</h1>
          <p className="text-gray-500 mb-7">
            Nhập email. Hệ thống gửi mã OTP gồm 6 số.
          </p>

          <form onSubmit={handleEmailSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="font-medium text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-12 bg-green-900 text-white font-medium rounded-md hover:bg-green-950 active:translate-y-px transition-all"
            >
              Gửi mã xác thực
            </button>

            <Link
              href="/login"
              className="w-full min-h-[42px] flex items-center justify-center bg-white border border-gray-200 rounded-md font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Quay lại đăng nhập
            </Link>
          </form>
        </>
      ) : (
        <>
          {/* OTP Step */}
          <div className="font-mono text-xs font-medium text-gray-600 mb-2.5">
            Kiểm tra email
          </div>
          <h1 className="text-3xl font-semibold leading-10 mb-2">Nhập mã OTP</h1>
          <p className="text-gray-500 mb-7">
            Đã gửi mã tới <b>{email}</b>. Hết hạn sau 04:32.
          </p>

          <form onSubmit={handleOtpSubmit} className="grid gap-4">
            {/* OTP Grid */}
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="aspect-square border border-gray-200 rounded-md text-center text-xl font-semibold outline-none hover:border-gray-300 focus:border-green-800 focus:ring-[3px] focus:ring-green-800/10 transition-colors"
                  required
                />
              ))}
            </div>

            <div className="grid gap-2">
              <label htmlFor="newPassword" className="font-medium text-sm">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <button
              type="submit"
              className="w-full min-h-12 bg-green-900 text-white font-medium rounded-md hover:bg-green-950 active:translate-y-px transition-all"
            >
              Đặt lại mật khẩu
            </button>

            <button
              type="button"
              onClick={() => console.log('Resend OTP')}
              className="text-sm font-medium text-green-800 hover:underline"
            >
              Gửi lại mã
            </button>
          </form>
        </>
      )}
    </div>
  )
}
