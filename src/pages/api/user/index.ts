import Cookies from 'cookies';

const handler = async (req, res) => {
    const { method } = req

    const cookies = new Cookies(req, res)

    const authHeader = req.headers.Authorization

    console.log(authHeader)

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        const [ Authorization ] = Buffer.from(authHeader, 'base64').toString().split(':')

        if(Authorization) {
            return res.status(200).json({
                Authorization
            })
        }
    }
    return res.status(200).json({
        Authorization: '',
        token: ''
    })
}


export default handler