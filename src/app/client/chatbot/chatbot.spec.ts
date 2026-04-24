import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError } from 'rxjs';
import { ChatbotComponent } from './chatbot';
import { ChatbotService } from './service/chatbot.service';
import { of } from 'rxjs';
import { MarkdownModule } from 'ngx-markdown';
import { test, vi } from 'vitest';
import { provideRouter } from '@angular/router';

/*
US-01:  Como usuario de LearnCode, quiero que el Chatbot me 
        salude al iniciar una conversación, para saber que 
        está disponible y listo para ayudarme.	
*/

describe('ChatbotComponent - US-01', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, MarkdownModule.forRoot(), HttpClientTestingModule],
      providers: [provideRouter([]), { provide: ChatbotService, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    await fixture.detectChanges();
  });

  it('debe mostrar mensaje de bienvenida al iniciar el chat', () => {
    expect(component.messages.length).toBeGreaterThan(0);

    const mensaje = component.messages[0].text;
    expect(mensaje).toContain('¡Hola!');
    expect(mensaje).toContain('¿Qué área te interesa explorar?');
  });
});

/*
  US-02:  Como usuario de LearnCode, quiero preguntar al Chatbot
          qué cursos estan disponibles, para saber qué puedo 
          estudiar en la plataforma.	
*/

describe('ChatbotComponent - US-02', () => {

  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;
  let chatbotServiceSpy: any;

  beforeEach(async () => {
    chatbotServiceSpy = { sendMessage: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, MarkdownModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ChatbotService, useValue: chatbotServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('debe enviar mensaje y recibir respuesta del chatbot', () => {

    component.inputText = 'Cursos disponibles';
    chatbotServiceSpy.sendMessage.mockReturnValue(
      of({ output: 'Tenemos Angular' })
    );
    component.send();

    expect(chatbotServiceSpy.sendMessage).toHaveBeenCalled();
    expect(component.messages.some(m => m.role === 'user')).toBe(true);
    expect(component.messages.some(m => m.text.includes('Angular'))).toBe(true);
  });

  it('debe mostrar mensaje de error si falla el servicio', () => {
    chatbotServiceSpy.sendMessage.mockReturnValue(
      throwError(() => new Error('Error de red'))
    );

    component.inputText = 'Hola';
    component.send();

    expect(component.messages.some(m => m.text.includes('error'))).toBe(true);
  });
});