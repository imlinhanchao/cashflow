<script setup lang="ts"></script>

<template>
  <section>
    <a-steps
      :current="1"
      :items="[
        {
          title: 'Finished',
          description,
        },
        {
          title: 'In Progress',
          description,
          subTitle: 'Left 00:00:08',
        },
        {
          title: 'Waiting',
          description,
        },
      ]"
    />
  </section>
</template>