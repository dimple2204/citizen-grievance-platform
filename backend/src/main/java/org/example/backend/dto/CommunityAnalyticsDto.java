package org.example.backend.dto;

public class CommunityAnalyticsDto {
    private long totalPosts;
    private long totalBroadcasts;
    private long totalEvents;
    private long totalPolls;

    public CommunityAnalyticsDto() {
    }

    public CommunityAnalyticsDto(long totalPosts, long totalBroadcasts, long totalEvents, long totalPolls) {
        this.totalPosts = totalPosts;
        this.totalBroadcasts = totalBroadcasts;
        this.totalEvents = totalEvents;
        this.totalPolls = totalPolls;
    }

    public long getTotalPosts() {
        return totalPosts;
    }

    public void setTotalPosts(long totalPosts) {
        this.totalPosts = totalPosts;
    }

    public long getTotalBroadcasts() {
        return totalBroadcasts;
    }

    public void setTotalBroadcasts(long totalBroadcasts) {
        this.totalBroadcasts = totalBroadcasts;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalPolls() {
        return totalPolls;
    }

    public void setTotalPolls(long totalPolls) {
        this.totalPolls = totalPolls;
    }
}
