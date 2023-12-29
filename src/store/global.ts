import { create } from "zustand"
import { State } from "../models/State"
import { Discount } from "@/models/Discount"
import { DiscountApproval } from "@/models/DiscountApproval"

const useStore = create<State>((set) => ({
    isSidebarEnabled: true,
    isDiscountEdit: false,
    isDiscountEditManagement: false,
    isDiscountClassRowEdit: false,
    searchDialog: false,
    discount: {
        name: '',
        description: '',
        totalBudget: 0,
        budgetRemaining: 0
    },
    discountApproval: {
        name: '',
        description: '',
        totalBudget: 0,
        budgetSpent: 0,
        allotted: 0,
        remaining: 0,
        studentsCount: 0,
        classesCount: 0,
        students: [],
        id: '',
        totalApproved: 0,
        totalPending: 0,
    },
    setIsDiscountEdit: (value: boolean) => set((state) => ({
        isDiscountEdit: value
    })),
    setSearchDialog: (value: boolean) => set((state) => ({
        searchDialog: value
    })),
    setIsDiscountEditManagement: (value: boolean) => set((state) => ({
        isDiscountEditManagement: value
    })),
    setIsDiscountClassRowEdit: (value: boolean) => set((state) => ({
        isDiscountClassRowEdit: value
    })),
    setDiscount: (discount: Discount) => set((state) => ({
        discount: discount
    })),
    setDiscountApproval: (discountApproval: DiscountApproval) => set((state) => ({
        discountApproval: discountApproval
    })),
    toggleSidebar: () => set((state) => ({
        isSidebarEnabled: !state.isSidebarEnabled
    })),
    closeSidebar: () => set((state) => ({
        isSidebarEnabled: false
    })),
    isLoggedIn: false,
    login: () => set((state: any) => ({
        isLoggedIn: true
    })),
    logout: () => set((state: any) => ({
        isLoggedIn: false
    })),
}))


export default useStore