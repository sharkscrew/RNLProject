import { useCallback, useState } from "react"

export const useModal = (initialstate: boolean) => {
    const [isOpen, setIsOpen] = useState(initialstate)

    const openModal = useCallback(() => setIsOpen(true), [])
    const closeModal = useCallback(() => setIsOpen(false), [])
    const toggleModal = useCallback(() => setIsOpen((prev) => !prev), [])

    return { isOpen, openModal, closeModal, toggleModal }
}