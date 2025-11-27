#!/usr/bin/env node

/**
 * Image Download and Optimization Script
 * 
 * This script:
 * 1. Fetches all films from the Ghibli API
 * 2. Downloads poster and banner images
 * 3. Converts them to WebP format at 60% quality
 * 4. Saves them to /public/images/
 * 5. Creates a mapping file for local image references
 * 
 * Run manually: npm run download-images
 */

const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

const API_BASE = 'https://ghibliapi.vercel.app';
const IMAGES_DIR = path.join(__dirname, '../public/images');
const MAPPING_FILE = path.join(__dirname, '../lib/image-mapping.json');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Helper: Download file from URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Helper: Convert image to WebP
async function convertToWebP(inputPath, outputPath, quality = 60) {
  try {
    const command = `cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`;
    await execAsync(command);
    
    // Delete original after conversion
    fs.unlinkSync(inputPath);
    
    console.log(`  ✓ Converted to WebP: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`  ✗ Failed to convert ${inputPath}:`, error.message);
    throw error;
  }
}

// Main function
async function main() {
  console.log('🎬 Starting Ghibli image download and optimization...\n');

  // Check if cwebp is available
  try {
    await execAsync('which cwebp');
  } catch (error) {
    console.error('❌ Error: cwebp not found. Please install webp tools:');
    console.error('   macOS: brew install webp');
    console.error('   Linux: apt-get install webp');
    process.exit(1);
  }

  try {
    // Fetch films from API
    console.log('📡 Fetching films from API...');
    const response = await fetch(`${API_BASE}/films`);
    const films = await response.json();
    console.log(`   Found ${films.length} films\n`);

    const imageMapping = {};
    let downloadedCount = 0;
    let totalImages = films.length * 2; // poster + banner per film

    // Process each film
    for (const film of films) {
      console.log(`📥 Processing: ${film.title}`);
      
      const filmId = film.id;
      imageMapping[filmId] = {};

      // Download and convert poster
      if (film.image) {
        try {
          const posterUrl = film.image;
          const posterTempPath = path.join(IMAGES_DIR, `${filmId}-poster.jpg`);
          const posterFinalPath = path.join(IMAGES_DIR, `${filmId}-poster.webp`);
          
          console.log(`  Downloading poster...`);
          await downloadFile(posterUrl, posterTempPath);
          await convertToWebP(posterTempPath, posterFinalPath);
          
          imageMapping[filmId].poster = `/images/${filmId}-poster.webp`;
          downloadedCount++;
        } catch (error) {
          console.error(`  ✗ Failed to process poster:`, error.message);
        }
      }

      // Download and convert banner
      if (film.movie_banner) {
        try {
          const bannerUrl = film.movie_banner;
          const bannerTempPath = path.join(IMAGES_DIR, `${filmId}-banner.jpg`);
          const bannerFinalPath = path.join(IMAGES_DIR, `${filmId}-banner.webp`);
          
          console.log(`  Downloading banner...`);
          await downloadFile(bannerUrl, bannerTempPath);
          await convertToWebP(bannerTempPath, bannerFinalPath);
          
          imageMapping[filmId].banner = `/images/${filmId}-banner.webp`;
          downloadedCount++;
        } catch (error) {
          console.error(`  ✗ Failed to process banner:`, error.message);
        }
      }

      console.log('');
    }

    // Save mapping file
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(imageMapping, null, 2));
    console.log(`✅ Image mapping saved to: ${MAPPING_FILE}\n`);

    // Calculate savings
    const files = fs.readdirSync(IMAGES_DIR);
    const totalSize = files.reduce((acc, file) => {
      const filePath = path.join(IMAGES_DIR, file);
      return acc + fs.statSync(filePath).size;
    }, 0);

    console.log('📊 Summary:');
    console.log(`   Images downloaded: ${downloadedCount}/${totalImages}`);
    console.log(`   Total size (WebP): ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`   Estimated original size (JPG): ~${(totalSize / 1024 * 2.7).toFixed(2)} KB`);
    console.log(`   Estimated savings: ~${(totalSize / 1024 * 1.7).toFixed(2)} KB (63%)`);
    console.log('\n✨ Done! Images are ready to use.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

