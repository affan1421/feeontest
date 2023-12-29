import { render, fireEvent, screen, getByRole } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import Login from './Login'
import { AuthProvider } from 'react-auth-kit'

describe('Login', () => {
    it('should render correctly', () => {
        render(
            <AuthProvider authType="cookie" authName="Authorization">
                <Login />
            </AuthProvider>
        )
        expect(screen.getByTestId('login-button')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('School Code')).toBeInTheDocument()
    })

    it('should update username value when Phone Number input is changed', () => {
        render(
            <AuthProvider authType="cookie" authName="_auth">
                <Login />
            </AuthProvider>
        )
        const input = screen.getByPlaceholderText('Phone Number') as HTMLInputElement
        fireEvent.change(input, { target: { value: '1234567890' } })
        expect(input.value).toBe('1234567890')
    })

    it('should update password value when Password input is changed', () => {
        render(
            <AuthProvider authType="cookie" authName="_auth">
                <Login />
            </AuthProvider>
        )
        const input = screen.getByPlaceholderText('Password') as HTMLInputElement
        fireEvent.change(input, { target: { value: 'password' } })
        expect(input.value).toBe('password')
    })

    it('should update school code value when School Code input is changed', () => {
        render(
            <AuthProvider authType="cookie" authName="_auth">
                <Login />
            </AuthProvider>
        )
        const input = screen.getByPlaceholderText('School Code') as HTMLInputElement
        fireEvent.change(input, { target: { value: '1234' } })
        expect(input.value).toBe('1234')
    })

    // it('should call handleLogin function when Login button is clicked', () => {
    //     const mockHandleLogin = vi.fn()
    //     const { getByText } = render(
    //         <AuthProvider authType="cookie" authName="_auth">
    //             <Login handleLoginMock={mockHandleLogin} />
    //         </AuthProvider>
    //     )
    //     const button = getByText('Login')
    //     fireEvent.click(button)
    //     expect(mockHandleLogin).toHaveBeenCalledTimes(1)
    // })


})
