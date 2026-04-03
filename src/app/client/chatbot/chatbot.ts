import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatbotService } from '../../service/chatbot.service';
import { MarkdownModule } from "ngx-markdown"; // Formate JSON para respuesta del Bot

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent {
  
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  inputText = '';
  loading = false;
  messages = [
    { role: 'bot', 
      text: `¡Hola! 👋 Bienvenido a LEARN CODE.
Descubre cursos diseñados para impulsar tu carrera en tecnología.

Estoy aquí para ayudarte a elegir el mejor curso para ti 💻
¿Qué área te interesa explorar?`

    }
  ];

  constructor(
    private chatbotService: ChatbotService,
    private cd: ChangeDetectorRef,
  ) { }

  send() {
    const text = this.inputText.trim();
    if (!text || this.loading) return;
    this.inputText = '';
    this.messages.push({ role: 'user', text });
    this.loading = true;
    
    this.cd.detectChanges();
    this.scrollBottom();

    this.chatbotService.sendMessage(text).subscribe({
      next: (res: { output: string }) => {
        this.messages.push({ role: 'bot', text: res.output });
        this.loading = false;

        
        this.cd.detectChanges();
        this.scrollBottom();
      },
      error: () => {
        this.messages.push({ role: 'bot', text: 'Lo siento, hubo un error. Intenta nuevamente.' });
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollBottom(), 100);
    }
  }

  private scrollBottom() {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}