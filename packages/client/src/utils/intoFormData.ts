export const intoFormData = (obj: object): FormData => {
    const formData = new FormData();

    Object.keys(obj).map((key) => {
        formData.append(key, obj[key as keyof typeof obj] ?? '');
    });

    return formData;
};
