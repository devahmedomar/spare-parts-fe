import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  template: `
    <div>
      <div
        class="file-upload-area"
        [class.dragover]="isDragging()"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="isDragging.set(false)"
        (drop)="onDrop($event)"
      >
        <input
          #fileInput
          type="file"
          accept="image/jpeg,image/png"
          (change)="onFileChange($event)"
        />
        @if (!previewUrl()) {
          <div>
            <div style="font-size:2rem;margin-bottom:8px">📁</div>
            <p style="font-size:0.875rem;color:var(--color-text-muted)">
              اضغط أو اسحب الصورة هنا
            </p>
            <p style="font-size:0.75rem;color:var(--color-text-light);margin-top:4px">
              JPG أو PNG - حجم أقصى 5MB
            </p>
          </div>
        } @else {
          <p style="font-size:0.75rem;color:var(--color-text-muted);margin-bottom:8px">اضغط لتغيير الصورة</p>
        }
      </div>

      @if (previewUrl()) {
        <div class="file-upload-preview">
          <img [src]="previewUrl()" alt="معاينة الصورة" />
        </div>
      } @else if (existingImageUrl) {
        <div class="file-upload-preview">
          <p style="font-size:0.75rem;color:var(--color-text-muted);margin-bottom:6px">الصورة الحالية:</p>
          <img [src]="existingImageUrl" alt="الصورة الحالية" />
        </div>
      }

      @if (error()) {
        <p class="form-error">{{ error() }}</p>
      }
    </div>
  `,
})
export class FileUploadComponent {
  @Input() existingImageUrl = '';
  @Output() fileSelected = new EventEmitter<File | null>();

  previewUrl = signal<string>('');
  isDragging = signal(false);
  error = signal('');

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    this.error.set('');
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.error.set('يُسمح فقط بصور JPG أو PNG');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error.set('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }
    const url = URL.createObjectURL(file);
    this.previewUrl.set(url);
    this.fileSelected.emit(file);
  }
}
