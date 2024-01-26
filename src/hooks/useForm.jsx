import { useState } from "react";

export function useForm({ defaultData, rules }) {

    const [formData, setFormData] = useState(defaultData)
    const [disabled, setDisabled] = useState(false)
    const [errors, setErrors] = useState(defaultData)

    function handleChange(e) {
        setErrors(defaultData)
        setDisabled(false)
        if (e.target.name.length > 0) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }
    }

    function validate() {
        setDisabled(true)
        let flag = true
        let result = {}
        const keys = Object.keys(formData)
        keys.forEach(key => {
            if (rules[key]?.required && formData[key]?.length === 0) {
                result[key] = { ...result[key], type: 'required' }
                setDisabled(false)
                flag = false
            }
            if (rules[key]?.minLength && formData[key]?.length < rules[key]?.minLength) {
                result[key] = { ...result[key], type: 'minLength' }
                setDisabled(false)
                flag = false
            }
            if (rules[key]?.maxLength && formData[key]?.length > rules[key]?.maxLength) {
                result[key] = { ...result[key], type: 'maxLength' }
                setDisabled(false)
                flag = false
            }
        })
        setErrors(result)
        return flag
    }

    function reset(setOpen = undefined) {
        setErrors(defaultData)
        setFormData(defaultData)
        setDisabled(false)
        if (setOpen) setOpen(null)
    }

    return {
        formData,
        setFormData,
        handleChange,
        disabled,
        setDisabled,
        validate,
        reset,
        errors
    }
}