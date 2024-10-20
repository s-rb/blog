---
title: Tech stack
layout: page
---

---

<h3>
Primary stack
</h3>

<div class="columns is-centered is-multiline is-mobile">
    {% for item in site.data.tech-stack.primary %}
    <div class="is-one-third-widescreen is-one-third-fullhd is-two-third-mobile is-three-quarters-touch"
         id="tech-stack-card">
        <img alt="{{item.title}}" class="tech-stack-image-card image is-marginless row" src="/assets/images/icons/{{ item.icon }}"/>
        <p class="tech-icon-text has-text-weight-medium has-text-grey">{{ item.title }}</p>
    </div>
    {% endfor %}
</div>

<h3>
Secondary stack
</h3>

<div class="columns is-centered is-multiline is-mobile">
    {% for item in site.data.tech-stack.secondary %}
    <div class="is-one-third-widescreen is-one-third-fullhd is-two-third-mobile is-three-quarters-touch"
         id="tech-stack-card">
        <img alt="{{item.title}}" class="tech-stack-image-card image is-marginless row" src="/assets/images/icons/{{ item.icon }}"/>
        <p class="tech-icon-text has-text-weight-medium has-text-grey">{{ item.title }}</p>
    </div>
    {% endfor %}
</div>

<h3>
Hobby stack
</h3>

<div class="columns is-centered is-multiline is-mobile">
    {% for item in site.data.tech-stack.hobby %}
    <div class="is-one-third-widescreen is-one-third-fullhd is-two-third-mobile is-three-quarters-touch"
         id="tech-stack-card">
        <img alt="{{item.title}}" class="tech-stack-image-card image is-marginless row" src="/assets/images/icons/{{ item.icon }}"/>
        <p class="tech-icon-text has-text-weight-medium has-text-grey">{{ item.title }}</p>
    </div>
    {% endfor %}
</div>