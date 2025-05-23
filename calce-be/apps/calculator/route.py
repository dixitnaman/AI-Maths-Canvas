from fastapi import APIRouter, UploadFile
import base64
from io import BytesIO
from apps.calculator.utlis import analyze_Image
from schema import ImageData 
from PIL import Image

router = APIRouter()

@router.post('')
async def run(data: ImageData):
      image_data=base64.b64decode(data.image.split(',')[1])
      image_bytes=BytesIO(image_data)
      image = Image.open(image_bytes)
      responses = analyze_Image(image, dict_of_vars=data.dict_of_vars)
      data=[]
      for response in responses:
            data.append(response)
      print('response in router:', response)
      return{
            "message": "Image processed",
            "type": "success",
            "data": data,
      }
