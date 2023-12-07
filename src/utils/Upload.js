import imgbbUploader from 'imgbb-uploader'

export const getDisplayUrl = async (buffer, api, name = 'Default-filename') => {
    return await imgbbUploader({
        apiKey: api,
        base64string: buffer,
        name
    })
        .then((res) => res.url)
        .catch((e) => 'http://placekitten.com/300/300')
}
