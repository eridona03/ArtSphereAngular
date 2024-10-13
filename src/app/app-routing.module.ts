import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { MyFriendlistComponent } from './my-friendlist/my-friendlist.component';
import { CircleArtworksComponent } from './circle-artworks/circle-artworks.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { AuthGuard } from './auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';


const routes: Routes = [
  { path: '', component: LogInComponent},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'view-profile', component: ViewProfileComponent},
  { path: 'my-profile', component: ProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'delete-profile', component: DeleteProfileComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'my-circle/my-friendlist', component: MyFriendlistComponent},
  { path: 'my-circle/artworks', component: CircleArtworksComponent},
  { path: 'my-circle/requests', component: MyRequestsComponent},
  { path: 'user-profile/:username', component: UserProfileComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
