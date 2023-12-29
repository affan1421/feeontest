export const getSchoolDetails = () => {
    const schoolName = localStorage.getItem('school_name') as string
    const schoolAddress = localStorage.getItem('school_address') as string
    return { schoolName, schoolAddress }
}