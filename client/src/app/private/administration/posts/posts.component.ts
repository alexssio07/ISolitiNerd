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

  currentPosts: Post[];
  users: any[];

  constructor(private blogService : BlogserviceService, private userService: UserService,) { }

  ngOnInit() {
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

}

// export enum  {
//   logout = 1,
//   sessionExpired = 2
// }
