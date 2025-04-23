import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderfooterComponent } from "./headerfooter/headerfooter.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ProductsComponent } from "./products/products.component";
import { ProfileComponent } from "./profile/profile.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  {
    path: "home", component: HeaderfooterComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "product", component: ProductsComponent },
      { path: "profile", component: ProfileComponent }
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" }, // Redirect to /home
  { path: "**", redirectTo: "/home" } // Wildcard route should always be last and use the full path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
