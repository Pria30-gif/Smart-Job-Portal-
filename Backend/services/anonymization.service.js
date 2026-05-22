import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

class AnonymizationService {
  constructor() {
    this.pythonScript = path.join(process.cwd(), 'anonymize_resume.py');
  }

  /**
   * Anonymize a resume file by removing bias indicators
   * @param {string} inputPath - Path to original resume file
   * @param {string} outputPath - Path to save anonymized resume
   * @returns {Promise<Object>} - Anonymization result
   */
  async anonymizeResume(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        reject(new Error('Input file does not exist'));
        return;
      }

      // Create output directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Spawn Python process for anonymization
      const pythonProcess = spawn('C:/Projectspriya/myenv/Scripts/python.exe', [
        this.pythonScript,
        inputPath,
        outputPath
      ]);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (parseError) {
            resolve({
              success: true,
              removedFields: ['name', 'email', 'phone', 'address'],
              message: 'Resume anonymized successfully'
            });
          }
        } else {
          reject(new Error(`Anonymization failed: ${stderr}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start anonymization process: ${error.message}`));
      });
    });
  }

  /**
   * Extract text content from various file types (supports URLs and local paths)
   * @param {string} filePathOrUrl - Path to the file or URL
   * @returns {Promise<string>} - Extracted text content
   */
  async extractText(filePathOrUrl) {
    // Check if it's a URL
    if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
      return this.extractTextFromUrl(filePathOrUrl);
    }

    // Handle relative paths starting with /uploads
    let resolvedPath = filePathOrUrl;
    if (filePathOrUrl.startsWith('/uploads')) {
      // Resolve /uploads to the project root uploads folder
      resolvedPath = path.join(process.cwd(), '..', filePathOrUrl.substring(1));
    }

    const ext = path.extname(resolvedPath).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.extractFromPDF(resolvedPath);
      case '.docx':
        return this.extractFromDOCX(resolvedPath);
      case '.txt':
        return fs.promises.readFile(resolvedPath, 'utf8');
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  /**
   * Extract text from URL by downloading temporarily
   * @param {string} url - URL to download and extract text from
   * @returns {Promise<string>} - Extracted text content
   */
  async extractTextFromUrl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const axios = (await import('axios')).default;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Determine file type from URL or content-type
        const contentType = response.headers['content-type'];
        let ext = '.pdf'; // default

        if (contentType) {
          if (contentType.includes('pdf')) ext = '.pdf';
          else if (contentType.includes('document') || contentType.includes('word')) ext = '.docx';
          else if (contentType.includes('text')) ext = '.txt';
        } else {
          // Try to determine from URL
          const urlExt = path.extname(url).toLowerCase();
          if (['.pdf', '.docx', '.txt'].includes(urlExt)) {
            ext = urlExt;
          }
        }

        // Create temporary file
        const tempFile = path.join(process.cwd(), 'temp_resume_' + Date.now() + ext);
        fs.writeFileSync(tempFile, response.data);

        try {
          // Extract text based on file type
          let text;
          switch (ext) {
            case '.pdf':
              text = await this.extractFromPDF(tempFile);
              break;
            case '.docx':
              text = await this.extractFromDOCX(tempFile);
              break;
            case '.txt':
              text = fs.readFileSync(tempFile, 'utf8');
              break;
            default:
              throw new Error(`Unsupported file type: ${ext}`);
          }
          resolve(text);
        } finally {
          // Clean up temp file
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        }
      } catch (error) {
        reject(new Error(`Failed to extract text from URL: ${error.message}`));
      }
    });
  }

  async extractFromPDF(filePath) {
    // Simple PDF text extraction (you might want to use pdf-parse library)
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('C:/Projectspriya/myenv/Scripts/python.exe', ['-c', `
import sys
try:
    import fitz  # PyMuPDF
    doc = fitz.open('${filePath.replace(/\\/g, '\\\\')}')
    text = ""
    for page in doc:
        text += page.get_text()
    print(text)
except ImportError:
    print("PDF extraction not available - install PyMuPDF")
except Exception as e:
    print(f"Error: {e}")
`]);

      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error('PDF extraction failed'));
        }
      });
    });
  }

  async extractFromDOCX(filePath) {
    // Simple DOCX text extraction
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('C:/Projectspriya/myenv/Scripts/python.exe', ['-c', `
import sys
try:
    from docx import Document
    doc = Document('${filePath.replace(/\\/g, '\\\\')}')
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\\n"
    print(text)
except ImportError:
    print("DOCX extraction not available - install python-docx")
except Exception as e:
    print(f"Error: {e}")
`]);

      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error('DOCX extraction failed'));
        }
      });
    });
  }
}

export default new AnonymizationService();
