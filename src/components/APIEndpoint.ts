import { blog_type, thread_type, thread_sort } from "../components/community/community"
/*
*Static object that can build endpoint
*/
export class APIEndpoint {
    //[prefix]
    static Prefix: string = "http://service.narvii.com/api/v1"
    // [auth]
    static Login: string = APIEndpoint.Prefix + "/g/s/auth/login"
    static JoiniedCommunities: string = APIEndpoint.Prefix + `/g/s/community/joined`


    // [COMPLILE ENDPOINTS]
    
    /**
     * construct api endpoint to get user profile ONLY GET
     * @param communityId 
     * @param userId 
     */
    static compileProfile(communityId: number, userId: string): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/user-profile/${userId}`
    }
    /**
     * construct api endpoint to work with comments on user profile GET|POST
     * @param communityId 
     * @param userId 
     */
    static compileProfileComent(communityId: number, userId: string): string {
        return APIEndpoint.compileProfile(communityId, userId) + `/comment`
    }


    static compileGetBlog(blogId: string, communityId: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/blog/${blogId}`
    }
    static compileGetComent(comentId: string, blogId: string): string {
        return APIEndpoint.Prefix + `/x${comentId}/s/blog/${blogId}/comment/${comentId}`
    }
    static compileGetComents(comentId: string, communityId: number, start: number, size: number): string {
        return APIEndpoint.compileGetBlog(comentId, communityId) + `/comment?start=${start}&size=${size}`
    }


    static compileGetOnlineMembers(communityId: number, start: number, size: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/live-layer?topic=ndtopic%3Ax${communityId}%3Aonline-members&start=${start}&size=${size}`
    }
    static compileGetBlogs(communityId: number, type: blog_type, start: number, size: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/feed/${type}?start=${start}&size=${size}`
    }
    static compileGetThreads(communityId: number, type: thread_type, sort: thread_sort, start: number, size: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/chat/thread?type=${type}&filterType=${sort}&start=${start}&size=${size}`
    }
    static compileGetCommunity(communityId: number): string {
        return APIEndpoint.Prefix + `/g/s-x${communityId}/community/info`
    }
    static compileCreateThread(communityId: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/chat/thread`
    }
    static compileGetRecentBlogs(id: string, communityId: number, start: number, size: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/blog?type=user&q=${id}&start=${start}&size=${size}`
    }
    
    static compileMessageWithId(messageId: string, threadId: any, communityId: number): string {
        return APIEndpoint.compileMessage(threadId, communityId) + `/${messageId}`
    }
    static compileMessage(threadId: any, communityId: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/chat/thread/${threadId}/message`
    }
    static compileGetMessageList(threadId: any, communityId: number, count: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/chat/thread/${threadId}/message?v=2&pagingType=t&size=${count}`
    }
    static compileThread(threadId: any, communityId: number): string {
        return APIEndpoint.Prefix + `/x${communityId}/s/chat/thread/${threadId}`
    }
    static compileThreadWithMember(threadId: any, communityId: number, memberID: string): string {
        return APIEndpoint.compileThread(threadId, communityId) + `/member/${memberID}`
    }
}