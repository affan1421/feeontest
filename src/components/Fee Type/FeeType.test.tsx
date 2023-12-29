import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, vi } from "vitest"
import FeeType from "./FeeType"
import { AuthProvider } from 'react-auth-kit'

describe("Fee Type", async () => {
    beforeEach(() => {
        render(
            <AuthProvider authType="cookie" authName="_auth">
                <FeeType />
            </AuthProvider>
        )
    })

    // List

    it('Dummy', () => {
        expect(0).toBe(0)
    })
    
    // it('should render the component', () => {
    //     expect(screen.getByText('Add New')).toBeInTheDocument()
    //     // expect(screen.getByText('Name')).toBeInTheDocument()
    //     // expect(screen.getByText('Description')).toBeInTheDocument()
    //     // expect(screen.getByText('Associated Account')).toBeInTheDocument()
    // })

    // it('should have total count of list', async () => {
    //     // Function to trigger that getFeetypes
    //     const getFeetypes = vi.fn()
    // })

    // it('calls myFunction when button is clicked', () => {
    //     const component: any = TestUtils.renderIntoDocument(<FeeType />)
    //     // const button = TestUtils.findRenderedDOMComponentWithTag(component, 'button')
    //     // const spy = vi.spyOn(component, 'myFunction')

    //     // TestUtils.Simulate.click(button)

    //     // expect(spy).toHaveBeenCalled()
    // })

    // Creation

    // it('should open the dialog on button click & contain all elements', () => {
    //     const addButton = screen.getByText('Add New')
    //     fireEvent.click(addButton)
    //     expect(screen.getByTestId('add-name')).toBeInTheDocument()
    //     expect(screen.getByTestId('add-description')).toBeInTheDocument()
    //     expect(screen.getByTestId('add-selectaccount')).toBeInTheDocument()
    //     expect(screen.getByTestId('add-save')).toBeInTheDocument()
    // })

    // it('should close the dialog on close icon click', async () => {
    //     const addButton = screen.getByText('Add New')
    //     fireEvent.click(addButton)
    //     const closeIcon = screen.getByTestId('close')
    //     fireEvent.click(closeIcon)
    //     await waitFor(() => {
    //         expect(screen.getByTestId('add-save')).not.toBeInTheDocument()
    //     })
    // })

    // it('should have response when clicked saved', async () => {
    //     // Mock the localStorage functions
    //     const mockLocalStorage = {
    //         getItem: vi.fn(),
    //     }
    //     Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

    //     // Set the mock localStorage value for school_id
    //     mockLocalStorage.getItem.mockReturnValueOnce('123456789012345678901234')

    //     const addButton = screen.getByText('Add New')
    //     fireEvent.click(addButton)

    //     const saveButton = screen.getByText('Save')
    //     fireEvent.click(saveButton)

    //     expect(screen.getByTestId('add-save')).toBeInTheDocument()
    //     await waitFor(() => {

    //         // expect(screen.queryByText('Select Account')).not.toBeInTheDocument()
    //         const datagrid = screen.getByRole('grid')
    //         expect(datagrid?.getAttribute('aria-rowcount')).toBe('10')
    //     })

    // })

    // // Edit 

    // it('should open edit dialog', async () => {
    //     const datagrid = screen.getByTestId('datagrid')
    //     waitFor(() => {
    //         // Wait for the Datagrid to load
    //         // expect(datagrid).not.toBeInTheDocument()

    //     }, {
    //         // timeout: 1000,
    //         // interval: 1000
    //     })

    // })

    // it('should contain all fields & update button', async () => {

    // })

    // it('should close dialog upon update', async () => {

    // })


})
