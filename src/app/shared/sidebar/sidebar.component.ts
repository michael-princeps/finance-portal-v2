import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChildren('sidebarmenu', { read: ElementRef }) collapseElements: QueryList<any>;
  currentUrl: string;
  constructor(private router: Router) {
    router.events.subscribe(eve => {
      if (eve instanceof NavigationEnd) {
        this.closeAllMenus();
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const childmenus = document.getElementsByClassName('has-child');
    let i;
    for (i = 0; i < childmenus.length; i++) {
      const submenu = childmenus[i] as HTMLElement;
      submenu.onclick = (e) => {
        const shouldOpen = submenu.classList.contains('has-child-open');
        e.preventDefault();
        this.closeAllMenus();

        const childmenu = submenu.lastElementChild;
        childmenu.addEventListener('click', eve => {
          eve.stopPropagation();
        });
        submenu.classList.add('has-child-open');
          childmenu.classList.add('show-submenu');
        e.stopPropagation();
        // submenu.classList.toggle('has-child-open');
        // childmenu.classList.toggle('show-submenu');
      };
    }

    const childSubMenus = document.getElementsByClassName('has-collapse')
    let k;
    for (k = 0; k < childSubMenus.length; k++) {
      const childsubmenu = childSubMenus[k] as HTMLElement;
      childsubmenu.onclick = (e) => {
        const shouldOpen = childsubmenu.classList.contains('has-collapse-open');
        e.preventDefault();
        this.closeAllChildMenus();

        const childmenu = childsubmenu.nextElementSibling;
        if (shouldOpen) {
          childsubmenu.classList.add('has-collapse-open');
          childmenu.classList.add('show-submenu-children');
        }
        e.stopPropagation();
        childsubmenu.classList.toggle('has-collapse-open');
        childmenu.classList.toggle('show-submenu-children');
      };
    }

  }

  closeAllMenus() {
    const menus = document.querySelectorAll('.has-child');
    menus.forEach(el => {
      el.classList.remove('has-child-open');
      el.lastElementChild.classList.remove('show-submenu');
    });
  }

  
  closeAllChildMenus() {
    const menus = document.querySelectorAll('.has-collapse');
    menus.forEach(el => {
      el.classList.remove('has-collapse-open');
      el.nextElementSibling.classList.remove('show-submenu-children');
    });
  }
  public isActive(base: string): boolean {
    return this.router.url.includes(`/${base}`);
  }
}
