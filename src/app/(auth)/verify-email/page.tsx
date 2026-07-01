'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { authService } from '@/lib/auth'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (otp.length !== 6) {
      setError('OTP phải gồm đúng 6 số.')
      return
    }
    setIsLoading(true)
    try {
      const response = await authService.verifyEmail({ email: email.trim(), otp })
      setMessage(response.message || 'Xác minh email thành công.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xác minh email.')
    } finally {
      setIsLoading(false)
    }
  }

  const resend = async () => {
    setError('')
    setMessage('')
    setIsLoading(true)
    try {
      const response = await authService.resendVerifyEmail({ email: email.trim() })
      setMessage(response.message || 'Đã gửi lại OTP xác minh.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg border border-gray-800 bg-gray-900 relative overflow-hidden">
          <div className="absolute w-3 h-3 left-[13px] top-1 bg-[#c7f227] rounded-full" />
          <div className="absolute w-[11px] h-[11px] left-1 top-3.5 bg-white rounded-full" />
        </div>
        <span className="text-lg font-semibold tracking-tight">PlayCourt</span>
      </div>
      <div className="font-mono text-xs font-medium text-gray-600 mb-2.5">Xác minh tài khoản</div>
      <h1 className="text-3xl font-semibold leading-10 mb-2">Nhập OTP email</h1>
      <p className="text-gray-500 mb-7">Mã xác minh gồm 6 số được gửi đến email đăng ký.</p>
      <form onSubmit={submit} className="grid gap-4">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {message && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 outline-none focus:border-green-800" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          OTP
          <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" minLength={6} maxLength={6} required className="w-full min-h-[42px] border border-gray-200 rounded-md bg-white px-3 py-2 tracking-[0.4em] outline-none focus:border-green-800" />
        </label>
        <button disabled={isLoading} className="w-full min-h-12 border border-[#e4d55a] bg-[var(--pc-tennis)]/70 text-[var(--pc-green-950)] font-medium rounded-md hover:bg-[var(--pc-tennis)] disabled:opacity-50">
          {isLoading ? 'Đang xử lý...' : 'Xác minh email'}
        </button>
        <button type="button" onClick={resend} disabled={isLoading || !email} className="text-sm font-medium text-green-800 hover:underline disabled:opacity-50">
          Gửi lại mã xác minh
        </button>
        <Link href="/login" className="text-center text-sm font-medium text-gray-700 hover:underline">Về đăng nhập</Link>
      </form>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-[420px]">Đang tải...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
