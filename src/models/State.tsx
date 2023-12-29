import { Discount } from "@/models/Discount"
import { DiscountApproval } from "./DiscountApproval"

export interface State {
    searchDialog: boolean,
    isSidebarEnabled: boolean,
    isDiscountEdit: boolean,
    isDiscountEditManagement: boolean,
    isDiscountClassRowEdit: boolean,
    discount: Discount,
    discountApproval: DiscountApproval,
    setIsDiscountEdit: (value: boolean) => void
    setSearchDialog: (value: boolean) => void
    setIsDiscountEditManagement: (value: boolean) => void
    setIsDiscountClassRowEdit: (value: boolean) => void
    setDiscount: (discount: Discount) => void
    setDiscountApproval: (discount: DiscountApproval) => void
    toggleSidebar: () => void
    closeSidebar: () => void,
    isLoggedIn: boolean,
    login: () => void
    logout: () => void
}