import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadDir: string;
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    options: {
      width?: number;
      height?: number;
      quality?: number;
    } = {}
  ): Promise<{ url: string; filename: string }> {
    this.validateFile(file);

    const { width = 800, height = 800, quality = 85 } = options;
    const filename = `${uuidv4()}.webp`;
    const filePath = path.join(this.uploadDir, filename);

    try {
      // Process image with sharp: resize, optimize, convert to WebP
      await sharp(file.buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toFile(filePath);

      const baseUrl = this.configService.get('BACKEND_URL') || 'http://localhost:4000';
      const url = `${baseUrl}/uploads/${filename}`;

      this.logger.log(`Image uploaded successfully: ${filename}`);
      return { url, filename };
    } catch (error) {
      this.logger.error(`Failed to process image: ${error.message}`);
      throw new BadRequestException('Failed to process image');
    }
  }

  async uploadAvatar(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    return this.uploadImage(file, {
      width: 200,
      height: 200,
      quality: 90,
    });
  }

  async uploadRequestImage(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    return this.uploadImage(file, {
      width: 800,
      height: 600,
      quality: 85,
    });
  }

  async deleteImage(filename: string): Promise<void> {
    if (!filename) return;

    try {
      const filePath = path.join(this.uploadDir, path.basename(filename));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted image: ${filename}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete image ${filename}: ${error.message}`);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, path.basename(filename));
  }
}