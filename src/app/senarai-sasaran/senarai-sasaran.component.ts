import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { UserService } from '../user.service';
import { PydService, SasaranKerjaListItem } from '../services/pyd.service';

@Component({
  selector: 'app-senarai-sasaran',
  imports: [ButtonModule, CardModule, DialogModule, TableModule, TagModule],
  templateUrl: './senarai-sasaran.component.html',
  styleUrl: './senarai-sasaran.component.css'
})
export class SenaraiSasaranComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private pydService = inject(PydService);

  // pydId!: number;
    pydId: number = this.userService.getPydId() as number; // default to logged-in user
    products: (SasaranKerjaListItem & { severity?: string; actionLabel?: string })[] = [];

  ngOnInit() {
    // this.pydId = Number(this.route.snapshot.paramMap.get('pydId')); // /senarai-sasaran/:pydId
    this.loadData(); // Just load the data without setting pydId from the route
  }

  loadData() {
    this.pydService.getSasaranByPyd(this.pydId).subscribe({
      next: list => {
        this.products = list.map(x => ({
          ...x,
          severity: x.status?.toLowerCase() === 'draf' ? 'warn'
                   : x.status?.toLowerCase() === 'sah' ? 'success'
                   : undefined,
          actionLabel: x.status?.toLowerCase() === 'draf' ? 'Kemas kini' : 'Lihat'
        }));
      },
      error: err => console.error(err)
    });
  }

  onButtonClick(row: SasaranKerjaListItem) {
    // navigate to a detail/edit page with SKT id
    this.router.navigate(['/sasaran', row.idSkt]);
  }
}
