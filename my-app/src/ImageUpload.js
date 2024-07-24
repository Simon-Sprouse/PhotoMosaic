import React, { useState, useRef } from 'react';

function ImageUpload() { 

    const [image, setImage] = useState(null); // file
    const [preview, setPreview] = useState(''); // data url

    const [chunks, setChunks] = useState([]);
    const canvasRef = useRef(null);


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

    function divideImage(rows, cols) { 
        if (!preview) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const newImage = new Image();
        newImage.src = preview;

        newImage.onload = () => { 
            const { width, height } = newImage;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(newImage, 0, 0, width, height);

            const chunkWidth = width / cols;
            const chunkHeight = height / rows;

            const chunksArray = [];

            for (let row = 0; row < rows; row++) { 
                for (let col = 0; col < cols; col++) { 
                    const x = col * chunkWidth;
                    const y = row * chunkHeight;

                    const imageData = ctx.getImageData(x, y, chunkWidth, chunkHeight);

                    chunksArray.push({
                        row,
                        col, 
                        imageData,
                        score: calculateChunkScore(imageData),
                    })
                }
            }

            setChunks(chunksArray);
        }

    }


    function calculateChunkScore(imageData) { 

        const data = imageData.data;
        let totalScore = 0;

        // loop through each pixel, four entries are RGBA
        for (let i = 0; i < data.length; i += 4) { 
            const score = 0.33 * data[i] + 0.33 * data[i + 1] + 0.33 * data[i + 1];
            totalScore += score;
        }

        totalScore /= (data.length / 4);

        return totalScore;
    }





    function handleButtonClick() { 
        const rows = 4;
        const cols = 4;
        
        divideImage(rows, cols);

        console.log(chunks);
    }






    return (
        <>
            <canvas ref={canvasRef} style={{ display: 'none'}}/>
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
            <button onClick={handleButtonClick}>Generate Chunks</button>
            
        </>
    )
}

export default ImageUpload;