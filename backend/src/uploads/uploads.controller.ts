import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as fs from 'fs';
import * as path from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadsService.uploadAvatar(file);
    return {
      message: 'Avatar uploaded successfully',
      ...result,
    };
  }

  @Post('request-image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadRequestImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadsService.uploadRequestImage(file);
    return {
      message: 'Image uploaded successfully',
      ...result,
    };
  }

  @Get(':filename')
  async getFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    console.log(`🖼️ Image request for: ${filename}`);
    console.log(`🖼️ Request headers:`, JSON.stringify(res.req.headers, null, 2));
    
    try {
      // Validate filename to prevent path traversal
      const sanitizedFilename = path.basename(filename);
      if (sanitizedFilename !== filename) {
        throw new BadRequestException('Invalid filename');
      }

      const filePath = this.uploadsService.getFilePath(sanitizedFilename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Determine content type based on file extension
      const ext = path.extname(sanitizedFilename).toLowerCase();
      let contentType = 'image/webp'; // default
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
      }
      
      // Set appropriate headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
      
      // Explicit CORS headers for image serving
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  }
}