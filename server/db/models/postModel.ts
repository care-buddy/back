import mongoose from 'mongoose';
import { Post, checkPost } from '../schemas/post';
import { Community } from '../schemas/community';

export class PostModel {
  // 글 생성
  async createPost(postData: checkPost) {
    const newPost = await Post.create(postData);
    return newPost;
  }

  // 특정 커뮤니티의 게시글 조회와 커뮤니티 정보 조회
  // async findPostsAndCommunity(communityId: string) {
  //   const [posts, community] = await Promise.all([
  //     Post.find({ communityId }) // 커뮤니티 ID로 게시글 조회
  //       .populate('userId')

  //       .populate('commentId'),
  //     Community.findById(communityId).populate({
  //       path: 'communityId',
  //       select: 'community category', // community와 category 필드만 가져옴
  //     }), // 커뮤니티 ID 문자열로 조회
  //   ]);

  //   return { posts, community };
  // }

  // 특정 커뮤니티의 게시글 조회와 커뮤니티 정보 조회
  async findPostsAndCommunity(communityId: string) {
    const [posts, community] = await Promise.all([
      Post.find({ communityId }) // 커뮤니티 ID로 게시글 조회
        .populate('userId')
        .populate({
          path: 'commentId',
          match: { deletedAt: { $eq: null } },
        }),
      Community.findById(communityId), // 커뮤니티 정보 조회
    ]);

    return { posts, community };
  }

  // 전체 글 조회
  async findAllPosts() {
    const posts = await Post.find({})
      .populate('userId')
      .populate('communityId')
      .populate({
        path: 'commentId',
        match: { deletedAt: { $eq: null } },
      });
    return posts;
  }

  // 글 하나 조회
  async findById(_id: mongoose.Types.ObjectId) {
    const posts = await Post.find({ _id })
      .populate('userId')
      .populate('communityId')
      .populate({
        path: 'commentId',
        populate: {
          path: 'userId',
          select: 'nickName profileImage',
        },
      });
    return posts;
  }

  // 글 수정
  async updatePost(_id: mongoose.Types.ObjectId, postData: checkPost) {
    const post = await Post.findOneAndUpdate({ _id }, postData, { new: true })
      .populate('userId')
      .populate('communityId')
      .populate({
        path: 'commentId',
        populate: {
          path: 'userId',
          select: 'nickName',
        },
      });
    return post;
  }

  // 글 삭제
  async deletePost(_id: mongoose.Types.ObjectId) {
    const deletepost = await Post.findOneAndUpdate(
      { _id },
      { deletedAt: new Date() },
      { new: true },
    );
    return deletepost;
  }

  async likeChange(
    _id: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    const post = await Post.findById(_id);
    if (!post) return { status: 404, err: '작업에 필요한 게시글이 없습니다.' };

    const alreadyLiked = post.likedUsers.includes(userId);
    let updatedPost;

    if (alreadyLiked) {
      // 이미 좋아요를 누른 상태이므로 좋아요를 제거
      updatedPost = await Post.findByIdAndUpdate(
        _id,
        { $pull: { likedUsers: userId } },
        { new: true },
      );
    } else {
      // 아직 좋아요를 누르지 않은 상태이므로 좋아요를 추가
      updatedPost = await Post.findByIdAndUpdate(
        _id,
        { $push: { likedUsers: userId } },
        { new: true },
      );
    }

    // 최종적으로 변경된 likedUsers 배열의 길이를 반환
    const LikesArray = updatedPost?.likedUsers;
    return LikesArray;
  }

  // 프로필 사진 등록
  async updatePostImage(_id: mongoose.Types.ObjectId, postImage?: string) {
    const result = await Post.findOneAndUpdate(
      { _id },
      { postImage },
      { new: true },
    );
    return result;
  }
}
const postModel = new PostModel();
export default postModel;
