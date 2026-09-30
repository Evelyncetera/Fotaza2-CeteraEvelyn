import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'fotaza2',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadArray = (fieldName) => (req, res, next) => {
    upload.array(fieldName)(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                req.session.mensaje = 'La imagen seleccionada supera el límite permitido de 10 MB. Elegí una imagen más pequeña.';
                req.session.tipoMensaje = 'warning';
                return res.redirect('/publicaciones/crear');
            }
            return next(err);
        }
        next();
    });
};

export { upload };