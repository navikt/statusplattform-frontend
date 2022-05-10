import Cookies from 'cookies';

const handler = async (req, res) => {
    const { method } = req

    const cookies = new Cookies(req, res)

    const authHeader = req.headers.authorization

    // console.log(res.cookies)

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        const [user, navIdent] = Buffer.from(authHeader, 'base64').toString().split(':')

        if(navIdent) {
            return res.status(200).json({
                user,
                navIdent,
            })
        }
    }
    return null
}


export default handler