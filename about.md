---
title: About me
layout: page
---


<h2>
{{site.data.work_experience.job-title}}
</h2>

{% for item in site.data.work_experience.description %}
<p class="cv-description">{{item}}</p>
{% endfor %}

---

<h3>
Working timeline
</h3>

<div class="timeline">
    <div class="timeline-container">
        <ul class="timeline-list">
            {% for item in site.data.work_experience.experience %}
            <li class="timeline-item">
                <div class="timeline-item-content">
                    <div class="timeline-position has-text-white">{{ item.position }}</div>
                    <div class="timeline-period has-text-white">{{ item.period.started }}{% if item.period.finished %} - {{item.period.finished}}{% else %} - now{% endif %}</div>
                    <a class="timeline-company-url has-text-white" href="{{ site.data.work_experience.companies[item.company].url }}" target="_blank" rel="noopener noreferrer">
                        {{ site.data.work_experience.companies[item.company].name }}
                    </a>
                    <span class="circle"></span>
                </div>
            </li>
            {% endfor %}
            <div></div>
            <div class="engineering-experience-msg">
                <div><hr class="timeline-hr"/></div>
                <div>Other experience</div>
                <div><hr class="timeline-hr"/></div>
            </div>
            {% for item in site.data.work_experience.engineering_experience %}
            <li class="timeline-item not-relevant-sum">
                <div class="timeline-item-content">
                    <div class="timeline-position has-text-white">{{ item.position }}</div>
                    <div class="timeline-period has-text-white">{{ item.period.started }}{% if item.period.finished %} - {{item.period.finished}}{% else %} - now{% endif %}</div>
                    <a class="timeline-company-url has-text-white" href="/" target="_blank" rel="noopener noreferrer">
                        {{ item.company }}
                    </a>
                    <span class="circle"></span>
                </div>
            </li>
            {% endfor %}
            <div></div>
            {% for item in site.data.work_experience.not_relevant_experience %}
            <li class="timeline-item not-relevant">
                <div class="timeline-item-content">
                    <div class="timeline-position has-text-white">{{ item.position }}</div>
                    <div class="timeline-period has-text-white">{{ item.period.started }}{% if item.period.finished %} - {{item.period.finished}}{% else %} - now{% endif %}</div>
                    <a class="timeline-company-url has-text-white" href="{{ site.data.work_experience.companies[item.company].url }}" target="_blank" rel="noopener noreferrer">
                        {{ site.data.work_experience.companies[item.company].name }}
                    </a>
                    <span class="circle"></span>
                </div>
            </li>
            {% endfor %}
        </ul>
    </div>
</div>
<div class="container timeline-toggle-button has-text-centered has-background-grey-darker has-text-white">SHOW DETAILS</div>

---

<h3>
Github activity
</h3>
<div class="calendar">Loading the data just for you.</div>


<script src="{{site.url}}{{site.baseurl}}/assets/js/toggle-timeline.js"></script>
<script src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js"></script>
<script>
    const github_username = '{{ site.github_username }}';
    GitHubCalendar(".calendar", github_username, { responsive: true, global_stats: false, cache: 36000 });
</script>