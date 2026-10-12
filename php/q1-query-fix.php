<?php
// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public archive read.
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
$search = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';

$args = [
    'post_type'      => 'post',
    'post_status'    => 'publish',
    'posts_per_page' => 10,
    'paged'          => $page,          // correct key for loop pagination
];

if ($search !== '') {
    $args['s'] = $search;
}

$q = new WP_Query($args);

$pages = (int) $q->max_num_pages;
$ad_index = 0; // counter across the page

if ($q->have_posts()) :
    ?>
    <h1>
        Page <?php echo esc_html($page); ?> of <?php echo esc_html($pages); ?>
        <?php if ($search !== '') : ?>
            : Search for <?php echo esc_html($search); ?>
        <?php endif; ?>
    </h1>

    <?php
    while ($q->have_posts()) :
        $q->the_post();

        $content = get_the_content();

        // Replace literal [ad] with a div; counter increments per marker.
        $content = preg_replace_callback(
            '/\[ad\]/',
            function () use (&$ad_index) {
                $ad_index++;
                return '<div class="ad ad-' . (int) $ad_index . '"></div>';
            },
            $content
        );

        ?>
        <article>
            <h2><?php the_title(); ?></h2>
            <div class="entry-content"><?php echo wp_kses_post($content); ?></div>
        </article>
        <?php
    endwhile;

    // Pagination links
    echo paginate_links([
        'current'   => $page,
        'total'     => $pages,
        'base'      => add_query_arg('page', '%#%'),
        'format'    => '',
        'add_args'  => $search !== '' ? ['s' => $search] : [],
    ]);

    wp_reset_postdata();
else :
    ?>
    <h1>
        <?php if ($search !== '') : ?>
            No results for “<?php echo esc_html($search); ?>”
        <?php else : ?>
            No posts found.
        <?php endif; ?>
    </h1>
    <?php
endif;