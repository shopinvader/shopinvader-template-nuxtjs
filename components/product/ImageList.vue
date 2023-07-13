<template>
  <template v-if="slider">
    <div class="image-slider" ref="slider">
      <div
        v-for="(image, index) in images"
        :id="'item' + index"
        ref="item"
        class="image-slider__item"
        :key="'img-' + index"
      >
        <img :src="image.large?.src" class="item-image" />
      </div>
    </div>
    <div class="slider-indicators">
      <a
        v-for="(image, index) in images"
        :key="'img-indicator' + index"
        class="slider-indicators__items"
        :class="'w-1/' + images.length"
        @mouseover="slideCarousel(index + 1)"
        @click="slideCarousel(index + 1)"
      >
        <img :src="image.medium?.src" class="items-image" />
      </a>
    </div>
    <div class="slider-indicators-mobile">
      <a
        v-for="(image, index) in images"
        :key="'img-indicator' + index"
        :href="'#item' + index"
        :data-item="'item' + index"
        ref="indicators"
        class="slider-indicators-mobile__items"
      >
        <icon icon="radix-icons:dot-filled" class="items-icons"></icon>
      </a>
    </div>
  </template>
  <template v-else>
    <div class="w-full rounded">
      <div
        v-for="(image, index) in images"
        :id="'item' + index"
        class="w-full bg-gray-100"
        :key="'img-' + index"
      >
        <img
          :src="image.large?.src"
          class="w-ful mx-auto max-h-full min-h-max p-6"
        />
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { ProductImageSet } from '~~/models/ProductImageSet'
import ProductImageVue from './ProductImage.vue'

export default {
  name: 'ImageListVue',
  components: {
    'product-image': ProductImageVue
  },
  props: {
    images: {
      type: Array<ProductImageSet>,
      required: true
    },
    slider: {
      type: Boolean
    }
  },
  mounted() {
    const items: HTMLElement[] | null = this.$refs.item
    const indicators: HTMLElement[] | null = this.$refs.indicators
    const options = {
      rootMargin: '0px',
      threshold: 0.75
    }

    const callback = (entries: HTMLElement[] | null) => {
      entries?.forEach((item) => {
        const { target } = item
        const selectedIndicator: HTMLElement = indicators?.find(
          (indicatorItem) => indicatorItem.dataset.item == target.id
        )

        if (item.intersectionRatio >= 0.75) {
          selectedIndicator.classList.add('text-secondary')
        } else {
          selectedIndicator.classList.remove('text-secondary')
        }
      })
    }
    const observer = new IntersectionObserver(callback, options)

    items?.forEach((item) => {
      observer.observe(item)
    })
  },
  methods: {
    slideCarousel(goToImageNumber: number) {
      let carouselContainer: HTMLElement | null = this.$refs.slider 
      let carouselWidth = carouselContainer?.clientWidth

      let targetImage = goToImageNumber - 1;

      let targetXPixel = carouselWidth * targetImage + 1

      carouselContainer?.scrollTo(targetXPixel, 0)
    }
  }
}
</script>
<style lang="scss">
.image-slider {
  @apply carousel w-full items-center rounded bg-gray-100 max-md:h-full;
  &__item {
    @apply carousel-item h-full w-full items-center justify-center bg-gray-100 max-md:max-h-96;
  }
  .item-image {
    @apply mx-auto max-h-96 min-h-max p-6 max-md:object-contain max-sm:w-full lg:max-h-full;
  }
}
.slider-indicators {
  @apply hidden w-full justify-start gap-2 py-2 lg:flex;
  &__items {
    @apply h-36 w-1/6 rounded bg-gray-50 cursor-pointer hover:bg-gray-200;
    .items-image {
      @apply mx-auto h-36 object-fill p-2;
    }
  }
}
.slider-indicators-mobile {
  @apply flex w-full justify-center gap-1 py-6 lg:hidden;
  &__items {
    @apply h-full transition duration-75 ease-in;
    .items-icons {
      @apply text-lg;
    }
  }
}
</style>
