import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { BlogserviceService } from 'src/app/services/blogservice.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

  isAuthenticated: boolean = false;
  currentPosts: Post[];
  users: any[];

  dataPubblicazioneFilter = 'DataPubblicazione';
  dataUltimaModificaFilter = 'DataUltimaModifica';
  autoreFilter = 'UsernameAuthor';
  categoriaFilter = '';
  votoFilter = '';
  filterPost = '';

  constructor(private authenticateService: AuthenticationServiceService, 
    private blogService: BlogserviceService, private userService: UserService, 
    private route: Router) { }

  ngOnInit() {
    this.isAuthenticated = this.checkIsAuthenticated();
    this.blogService.getAllPosts().then(value => {
      this.setPosts(value);
      this.userService.getUsers().then(value => {
        this.setUsers(value);
        this.setAuthorPosts();
      });
    });
  }

  setPosts(posts) {
    this.currentPosts = posts;
  }

  getPosts() {
    return this.currentPosts;
  }

  setUsers(users) {
    this.users = users;
  }

  getUsers() {
    return this.users;
  }

  setAuthorPosts() {
    for (let index = 0; index < this.currentPosts.length; index++) {
      for (let ind = 0; ind < this.users.length; ind++) {
        var post = this.currentPosts[index];
        if (post.ID_User === this.users[ind].ID) {
          this.currentPosts[index].UsernameAuthor = this.users[ind].Username;
        }
      }
    }
  }

  apriPosts(post) {
    this.route.navigate(['/blog/post/' + post.ID]);
  }

  checkIsAuthenticated(): boolean {
    if (this.authenticateService.getUsernameCookie() !== '' && this.authenticateService.getUsernameCookie() !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }
}
