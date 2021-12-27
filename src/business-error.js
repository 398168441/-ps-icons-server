export const errors = {
    OTHER: 1000,
    FILE_NOT_EXIST: 1001,
    FILE_ALREADY_EXIST: 1002,

}

const errorMsgs = {
    [errors.FILE_NOT_EXIST]: '文件不存在',
    [errors.FILE_ALREADY_EXIST]: '文件已存在',
}
class BusinessError extends Error {
    constructor(code, message) {
        super(message || errorMsgs[code])
        this.code = code
    }
}

export default BusinessError
