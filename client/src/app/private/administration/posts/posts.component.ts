import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post';
import { BlogserviceService } from 'src/app/services/blogservice.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  @Input('isOpen') isOpen: boolean;

  currentPost: Post;
  currentPosts: Post[];
  users: any[];
  votiTotaliPosts: any = 0;
  votoMediaPosts: any = 0;
  commentiTotali: any = 0;
  postTotali: number = 0;
  usersCommentiTotali: number = 0;

  constructor(private blogService : BlogserviceService, private userService: UserService,) { }

  ngOnInit() {
    this.blogService.getAllPosts().then(value => {
      this.setPosts(value);
      this.getPostsTotali();
      this.getVotiTotali();
      this.userService.getUsers().then(value => {
        this.setUsers(value);
        this.setAuthorPosts();
      });
    });
  }

  mostraPost(id) {
    this.blogService.getPost(id).then(post => {
      this.currentPost = JSON.parse(JSON.stringify(post));
      this.setAuthorCurrentPost();
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

  setAuthorCurrentPost() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.currentPost.ID_User === this.users[i].ID) {
        this.currentPost.UsernameAuthor = this.users[i].Username;
      }
    }
  }
  
  getVotiTotali() {
    for (let i = 0; i < this.currentPosts.length; i++) {
      if (this.currentPosts[i].VotiTotali > 0) {
        this.votiTotaliPosts += this.currentPosts[i].VotiTotali;
      }
    }
  }

  getPostsTotali() {
    this.postTotali = this.currentPosts.length;
  }

  getUsersCommenti() {
    // for (let i = 0; i < this.currentPosts.length; i++) {
    //   const element = this.currentPosts[i];
    //   if (this.currentPosts[i].)
    // }
  }
}

// export enum  {
//   logout = 1,
//   sessionExpired = 2
// }
