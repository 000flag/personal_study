// 각 문자열 필드에서 쉼표로 구분된 사진 개수 세기
export const countPhotos = (field: string | null | undefined): number => {
    if (!field || field.trim() === "") return 0;
    return field.split(",").filter(Boolean).length;
};
