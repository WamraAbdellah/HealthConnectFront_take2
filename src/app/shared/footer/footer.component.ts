import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="copyright">
            &copy; 2025 HealthConnect. All rights reserved.
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <a href="#" class="footer-link">Terms of Service</a>
            <a href="#" class="footer-link">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f8f9fa;
      padding: 1.5rem 0;
      border-top: 1px solid #e9ecef;
      margin-top: 2rem;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .copyright {
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    .footer-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .footer-link {
      color: #6c757d;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }
    
    .footer-link:hover {
      color: #0073e6;
    }
    
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}