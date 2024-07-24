import React, { useState } from 'react';

function ImageUpload() { 

    const [image, setImage] = useState(null); // file
    const [preview, setPreview] = useState(''); // data url


    function handleImageUpload(event) { 
        const file = event.target.files[0];
        if (file) { 
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => { 
                setPreview(reader.result);
            }
            reader.readAsDataURL(file);
        }
    };






    return (
        <>
            <p>Upload an Image</p>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
            />
            {preview && (
                <div>
                    <p>Image Preview:</p>
                    <img src={preview} />
                </div>
            )}
        </>
    )
}

export default ImageUpload;